export enum EAlertClass {
    Primary = 'alert-primary',
    Secondary = 'alert-secondary',
    Success = 'alert-success',
    Danger = 'alert-danger',
    Warning = 'alert-warning',
    Info = 'alert-info',
    Light = 'alert-light',
    Dark = 'alert-dark',
}

const Alert = (props: {show: boolean, message: string, alertClass: EAlertClass }) => {
    
    return props.show ? <div className={'alert ' + props.alertClass} role="alert">{props.message}</div> : null;
}

export default Alert;