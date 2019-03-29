import { BaseModel } from './base.model';
import { Document } from './document';
import { ObjectType } from './objectType';

export class CollateralMeasurement {

    id: number;
    collateralMeasurementId: number;
    measuredArea: string;
    measuredUnit: string;
    locationAddress: string;
    generalDescription: string;
    measuredQuantity: string;
    // objectType: string;
    objectTypeId: number;
    objectType: ObjectType = new ObjectType();
    

}
