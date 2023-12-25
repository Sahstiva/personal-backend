import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private _isApiKeyValid: boolean = false;

  get isApiKeyValid(): boolean {
    return this._isApiKeyValid;
  }

  set isApiKeyValid(value: boolean) {
    this._isApiKeyValid = value;
  }
}
