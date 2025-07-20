export interface InputProps {
    labelText: string;
    id: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur:  (e: React.FocusEvent<HTMLInputElement>) => void
    placeholder: string;
    type: React.HTMLInputTypeAttribute;
}