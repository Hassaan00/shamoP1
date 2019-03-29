import { Document } from "./document";
import { Resource } from "./resource";
import { PoliceStation } from "./policeStation";
import { LawFirm, ApprovedLawFirm } from "./lawFirm";

export class Fir {
    id: number;
    firId: number;
    caseBasicId: number;
    caseBasic: any;
    investigationOfficerName: string;
    investigationOfficerDesignation: string;
    investigationOfficerAddress: string;

    firResourceId: number;
    firResource: Resource = new Resource();

    policeStationId: number;
    policeStation: PoliceStation = new PoliceStation();

    firDate: string;
    firDescription: string;

    // FirParty: FirParty[] = new Array<FirParty>();
    firParty: FirParty[] = [];

    FirLawFirm = new Array<FirLawFirm>();
    lawFirmIds: number[] = [];
    lawFirms: LawFirm[] = [];
    
    firLawFirmIds: number[] = [];
    firLawFirms: ApprovedLawFirm[] = [];

    firDocs: Document[] = [];
    firDocument = [];

}

export class FirParty {
    // Id: number;
    PartyName: string;
    PartyCnic: string;
    PartyNtn: string;
    PartyContactNumber: string;
    PartyAddress: string;
}

export class FirLawFirm {
    LawFirmId: number;
}
