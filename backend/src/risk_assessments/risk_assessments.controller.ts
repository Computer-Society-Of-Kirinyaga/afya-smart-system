import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateRiskAssessmentDto } from './dto/create-risk_assessment.dto';
import { RiskAssessmentsService } from './risk_assessments.service';
import { RiskAssessment } from './entities/risk_assessment.entity';

@Controller('risk-assessments')
// @UseGuards(JwtAuthGuard)
export class RiskAssessmentsController {
  constructor(
    private readonly riskAssessmentsService:RiskAssessmentsService) {}

  /**
   * Create a new risk assessment manually
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateRiskAssessmentDto) {
    return this.riskAssessmentsService.create(createDto);
  }

  //This will be triggerd by the cron through the assessment service not controller

  // /**
  //  * Trigger risk assessment for a specific user
  //  * This will analyze recent readings and generate a risk assessment
  //  */
  // @Post('assess/:userId')
  // @HttpCode(HttpStatus.OK)
  // async assessUserRisk(@Param('userId', ParseUUIDPipe) userId: string) {
  //   const assessment = await this.riskAssessmentsService.assessUserRisk(userId);
    
  //   if (!assessment) {
  //     return {
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: 'No readings found for this user in the last hour',
  //     };
  //   }
    
  //   return {
  //     message: 'Risk assessment completed successfully',
  //     assessment,
  //   };
  // }

  /**
   * Get the latest risk assessment for a user
   */

  @Get('latestAssessment/:userId')
  @HttpCode(HttpStatus.OK)
  async getLatestAssessment(@Param('userId', ParseUUIDPipe) userId: string) {
    const assessment = await this.riskAssessmentsService.getLatestAssessment(userId);
    
    if (!assessment) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No risk assessments found for this user',
        assessment: null,
      };
    }
    
    return assessment;
  }


  /**
   * Get all risk assessments for a user with optional filters
   */
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getAssessmentsForUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const options = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    
    const assessments = await this.riskAssessmentsService.getAssessmentsForUser(
      userId,
      options,
    );
    
    return {
      userId,
      count: assessments.length,
      assessments,
    };
  }


  /**
   * Get risk history with trends for a user
   * Returns assessments, risk trend, and days since last healthy
   */
  @Get('history/:userId')
  @HttpCode(HttpStatus.OK)
  async getRiskHistory(@Param('userId', ParseUUIDPipe) userId: string) {
    const history = await this.riskAssessmentsService.getRiskHistory(userId);
    
    return {
      userId,
      ...history,
    };
  }

  /**
   * Update alert status for a specific assessment
   */
  @Patch(':assessmentId/alert-status')
  @HttpCode(HttpStatus.OK)
  async updateAlertStatus(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Body('alertSent') alertSent: boolean,
  ) {
    await this.riskAssessmentsService.updateAlertStatus(assessmentId, alertSent);
    
    return {
      message: 'Alert status updated successfully',
      assessmentId,
      alertSent,
    };
  }



  // /**
  //  * Get a single risk assessment by ID
  //  */
  // @Get(':assessmentId')
  // @HttpCode(HttpStatus.OK)
  // async getAssessmentById(@Param('assessmentId', ParseUUIDPipe) assessmentId: string) {
  //   const assessment = await this.riskAssessmentsService.getAssessmentsForUser(assessmentId);
    
  //   if (!assessment) {
  //     return {
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: 'Risk assessment not found',
  //     };
  //   }
    
  //   return assessment;
  // }

  // /**
  //  * Get recent risk alerts (assessments with alerts sent)
  //  * Useful for dashboard overview
  //  */
  // @Get('alerts/recent')
  // @HttpCode(HttpStatus.OK)
  // async getRecentAlerts(@Query('limit') limit?: string) {
  //   const alertLimit = limit ? parseInt(limit, 10) : 10;
    
  //   const alerts = await this.riskAssessmentsService.find({
  //     where: { alert_sent: true },
  //     relations: ['user'],
  //     order: { alert_sent_at: 'DESC' },
  //     take: alertLimit,
  //   });
    
  //   return {
  //     count: alerts.length,
  //     alerts,
  //   };
  // }

  /**
   * Get risk statistics dashboard data
   * Returns aggregated stats for all users
   */
  @Get('stats/dashboard/:userId')
  @HttpCode(HttpStatus.OK)
  async getDashboardStats(@Param('userId') userId: string) {
    return await this.riskAssessmentsService.getAssessmentsForUser(userId);
    
  }

  // /**
  //  * Bulk trigger risk assessment for all active users
  //  * This would be called by the cron job
  //  */
  // @Post('bulk-assess')
  // @HttpCode(HttpStatus.ACCEPTED)
  // async bulkAssessUsers() {
  //   // Get all users with recent readings
  //   const users = await this.riskAssessmentsService.usersService.findAll();
    
  //   const results = {
  //     total: users.length,
  //     processed: 0,
  //     failed: 0,
  //     details: [] as any[],
  //   };
    
  //   // Process each user (consider using queue for large scale)
  //   for (const user of users) {
  //     try {
  //       const assessment = await this.riskAssessmentsService.assessUserRisk(user.id);
  //       results.processed++;
  //       results.details.push({
  //         userId: user.id,
  //         status: 'success',
  //         riskLevel: assessment?.risk_level || 'no_data',
  //       });
  //     } catch (error) {
  //       results.failed++;
  //       results.details.push({
  //         userId: user.id,
  //         status: 'failed',
  //         error: error.message,
  //       });
  //     }
  //   }
    
  //   return results;
  // }
  
}