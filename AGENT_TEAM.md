# Học Vui Agent Team

Tài liệu này mô tả cách dùng bộ skill/role cho dự án Học Vui.

## Quy Trình Mặc Định

Mỗi task lớn nên đi qua 5 lớp:

1. Product + Executive: xác định mục tiêu, MVP, ưu tiên, success metric.
2. Architecture + Data: xác định module, API, schema, bảo mật, scale.
3. UX/UI: dùng Stitch trước khi sửa giao diện, giữ đúng design system Học Vui.
4. Learning + Content: kiểm tra chương trình học, question bank, adaptive learning, gamification.
5. QA + Security + Review: lint/build/test, kiểm tra authz, child-data safety, review trước khi kết thúc.

## Skill Mapping

- Product/Executive: `hoc-vui-edtech-team`, `cpo-advisor`, `cto-advisor`, `product-manager-toolkit`, `product-strategist`.
- UX/UI: `ux-researcher-designer`, `ui-design-system`, `senior-frontend`, `epic-design`.
- Backend/API/Auth: `senior-backend`, `senior-fullstack`, `api-design-reviewer`, `senior-security`.
- Database/Analytics: `database-schema-designer`, `database-designer`, `sql-database-assistant`, `senior-data-engineer`, `product-analytics`.
- Learning/CMS/Gamification: dùng `hoc-vui-edtech-team` làm orchestrator, kết hợp `product-manager-toolkit`, `senior-backend`, `senior-frontend`, `product-analytics`.
- Security/Compliance: `senior-security`, `security-pen-testing`, `skill-security-auditor`, `gdpr-dsgvo-expert`, `ai-act-readiness`, `compliance-readiness`.
- QA/DevOps/SRE: `senior-qa`, `api-test-suite-builder`, `performance-profiler`, `senior-devops`, `observability-designer`, `slo-architect`.
- Payments/Premium: `stripe-integration-expert`, `pricing-strategist`.
- Final review: `code-reviewer`, `senior-architect`, `senior-security`.

## Học Vui Rules

- Không sửa UI khi chưa kiểm tra Stitch/design reference nếu task liên quan giao diện.
- Không để client truyền hoặc quyết định quyền sở hữu dữ liệu parent/profile.
- Student chỉ dùng câu hỏi `published` và đúng usage flag.
- Parent dashboard phải dựa trên dữ liệu thật từ DB/API, không hardcode số liệu.
- Với dữ liệu trẻ em, thiết kế theo chuẩn an toàn quốc tế: tối thiểu hóa dữ liệu, không public child profile, không expose dữ liệu nhạy cảm.
- Trước khi kết thúc task code: chạy `npm run lint`, `npm run build` nếu có thay đổi runtime.
