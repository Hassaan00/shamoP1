export class FlagData {
    caseBasicId: number;
    caseHearing: boolean = false;
    caseHearingDescription: string;
    decreeDurationCount: boolean = false;
    decreeDurationDescription: string;
    nextHearingDate: boolean = false;
    nextHearingDateDescription: string;
    complianceNotSubmitted: boolean = false;
    complianceNotDescription: string;
    suitFileDuration: boolean = false;
    suitFileDurationDescription: string;
    caseUnFavorable: boolean = false;
    caseUnFavorableDescription: string;

    isFlagTooltip: string;
    isFlagShow: boolean = false;
}