import { getGradeData } from '@/lib/data'
import prisma from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl
    const grade = searchParams.get('grade') || 'lop-1'
    const world = parseInt(searchParams.get('world') || '1', 10)
    const level = parseInt(searchParams.get('level') || '1', 10)
    const isBoss = searchParams.get('boss') === 'true'

    // 1. Get static questions
    const gradeData = getGradeData(grade)
    let staticQuestions = []
    if (gradeData && typeof gradeData.getQuestionsForGame === 'function') {
      staticQuestions = gradeData.getQuestionsForGame(world, level, isBoss)
    }

    // 2. Fetch custom questions from database
    const dbQuestions = await prisma.customQuestion.findMany({
      where: {
        grade,
        worldId: world,
        ...(isBoss ? {} : { levelId: level }) // Boss pulls from all levels of the world
      }
    })

    // Map DB questions back to the format the games expect
    const mappedDbQuestions = dbQuestions.map(q => {
      if (q.type === 'matching') {
        return {
          id: q.id,
          left: q.q,
          right: q.options, // stored as right card text
          subject: q.subject,
          topic: q.topic,
          world: q.worldId,
          level: q.levelId
        }
      } else if (q.type === 'listen') {
        let parsedOptions = []
        try {
          parsedOptions = JSON.parse(q.options)
        } catch {
          parsedOptions = q.options.split(',').map(s => s.trim())
        }
        return {
          id: q.id,
          word: q.q,
          options: parsedOptions,
          correct: q.correct,
          subject: q.subject,
          topic: q.topic,
          world: q.worldId,
          level: q.levelId
        }
      } else {
        // choose 1 of 2
        let parsedOptions = []
        try {
          parsedOptions = JSON.parse(q.options)
        } catch {
          parsedOptions = q.options.split(',').map(s => s.trim())
        }
        return {
          id: q.id,
          q: q.q,
          options: parsedOptions,
          correct: q.correct,
          emoji: q.emoji,
          subject: q.subject,
          topic: q.topic,
          world: q.worldId,
          level: q.levelId
        }
      }
    })

    // Merge static and custom questions
    const combined = [...staticQuestions, ...mappedDbQuestions]

    // Shuffle helper
    const shuffle = (array) => {
      const arr = [...array]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

    const shuffled = shuffle(combined)

    // Slice to normal game lengths to avoid overwhelming the child
    // Normal level: 4-5 questions. Boss level: 8 questions.
    const result = isBoss ? shuffled.slice(0, 8) : shuffled.slice(0, 5)

    return Response.json(result)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
