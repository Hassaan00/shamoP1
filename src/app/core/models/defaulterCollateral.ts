import { BaseModel } from './base.model';
import { Document } from './document';
import { CollateralOption } from './collateralOption';
import { MortgageType } from './mortgageType';
// import { MortgageOption } from './mortgageOption';
import { MortgageOptionDetail } from './mortgageOptionDetail';
import { DefaulterCollateralValuation } from './defaulterCollateralValuation';
import { CollateralMeasurement } from './collateralMeasurement';
import { DefaulterPersonalGuarantee } from './defaulterPersonalGuarantee';
import { MortgageOption } from './mortgageOption';
import { ObjectType } from './objectType';

export class DefaulterCollateral {

    id: number;
    isEquitable: boolean;
    isRegisterable: boolean;
    collateralOption: CollateralOption = new CollateralOption();

    // mortgageTypeList: MortgageType[] = [];
    mortgageType: MortgageType = new MortgageType();
    // mortgageOption: MortgageOption = new MortgageOption();

    mortgageOptionList: MortgageOption[] = [];
    mortgageOptionDetailList: MortgageOptionDetail[] = [];
    mortgageOptionDetailTypeList: ObjectType[] = [];
    
    mortgageOptionDetail: MortgageOptionDetail = new MortgageOptionDetail();

    defaulterCollateralValuation: DefaulterCollateralValuation[] = [];
    collateralMeasurement: CollateralMeasurement = new CollateralMeasurement();

    defaulterCollateralDetail: CollateralMeasurement = new CollateralMeasurement();
    // defaulterCollateralDetail: CollateralMeasurement[] = [];

    defaulterPersonalGuarantee: DefaulterPersonalGuarantee = new DefaulterPersonalGuarantee();
    defaulterCollateralDocument: any;
    // document: Document = new Document();
    documents: Document[] = [];
    defaulterAccountId: string;

}
