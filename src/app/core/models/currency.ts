import { BaseModel } from './base.model';
import { Country } from './country';

export class Currency {

    id: number = null;
    cuurencyId: number = null;
    displayName: string = null;
    selected: boolean;
    codeName: string;
    country: Country;
    value: string;

}
