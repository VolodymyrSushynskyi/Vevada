import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  imports: [],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInput),
      multi: true
    }
  ]
})
export class UiInput implements ControlValueAccessor{
  @Input() label: string = 'Default label';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';

  value: string = '';
  isDisabled: boolean = false;
  isFocused: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};


  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }


  handleFocus() {
    this.isFocused = true;
  }

  handleBlur() {
    this.isFocused = false;
    this.onTouched(); 
  }

  handleInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val); 
  }
}
