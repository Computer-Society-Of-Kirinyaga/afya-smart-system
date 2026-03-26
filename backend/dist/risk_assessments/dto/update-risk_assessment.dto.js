"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRiskAssessmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_risk_assessment_dto_1 = require("./create-risk_assessment.dto");
class UpdateRiskAssessmentDto extends (0, mapped_types_1.PartialType)(create_risk_assessment_dto_1.CreateRiskAssessmentDto) {
}
exports.UpdateRiskAssessmentDto = UpdateRiskAssessmentDto;
//# sourceMappingURL=update-risk_assessment.dto.js.map