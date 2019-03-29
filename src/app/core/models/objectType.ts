import { BaseModel } from './base.model';
import { Document } from './document';
import { MortgageOption } from './mortgageOption';

export class ObjectType {

    id: number = null;
    objectTypeId: number = null;
    objectTypeName: string = null;
    selected: boolean = false;
    objectTypeCode: string = null;
    objectTypeDescription: string = null;
    objectTypeDetailTooltip: string = null;
    sortOrder: number = null;
    isActive: boolean = false;

}
