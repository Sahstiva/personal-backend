import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private requestContext: RequestContextService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    this.requestContext.isApiKeyValid = this.validateApiKey(apiKey);

    return !!this.requestContext.isApiKeyValid;
  }

  private validateApiKey(apiKey: string): boolean {
    const validApiKey = process.env.API_KEY;
    return apiKey === validApiKey;
  }
}
