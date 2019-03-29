export enum MessageTypes {
    Information,
    Confirmation,
    Warning,
    Error
}

export class Message {

    msgType: MessageTypes = MessageTypes.Information;
    iconType = 'info';
    msg = '';
    // title = 'LMS';
    title = 'LC';
    autoCloseAfter = 0;
    okBtnTitle = 'Ok';
    cancelBtnTitle = 'Cancel';
    showInput = 'none';
    // selectedDatesWorkingDay:Schedule;
    // onOkBtnClick : (res,id) => any;
    onOkBtnClick: () => any;
    // onCancelBtnClick : () => any;
    onCancelBtnClick: () => any;
}
