"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHealthReadingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_health_reading_dto_1 = require("./create-health-reading.dto");
class UpdateHealthReadingDto extends (0, mapped_types_1.PartialType)(create_health_reading_dto_1.CreateHealthReadingDto) {
}
exports.UpdateHealthReadingDto = UpdateHealthReadingDto;
//# sourceMappingURL=update-health-reading.dto.js.map