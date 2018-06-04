import { CanUpdateErrorState, MatFormFieldControl, MatInputBase, mixinErrorState } from '@angular/material';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewEncapsulation
} from '@angular/core';

import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs/Subject';

// tslint:disable-next-line:typedef
export const _MatInputMixinBase = mixinErrorState(MatInputBase);


@Component({
  selector: 'mat-ngx-wig',
  templateUrl: './mat-ngx-wig.component.html',
  styleUrls: [
    './mat-ngx-wig.component.scss',
    '../styles/components/component-wrapper.scss',
    '../styles/vendor/ng-wig.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: MatNgxWigComponent
    }
  ],
  host: {
    '[attr.id]': 'id',
    class: 'component-wrapper'
  }
})
export class MatNgxWigComponent extends _MatInputMixinBase
                                implements CanUpdateErrorState,
                                           ControlValueAccessor,
                                           MatFormFieldControl<string>,
                                           OnChanges,
                                           OnInit,
                                           DoCheck,
                                           OnDestroy {
  private static nextId: number = 0;

  protected _uid: string = `lms-mat-ngx-wig-${MatNgxWigComponent.nextId++}`;

  @Input()
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value || this._uid;
  }

  protected _id: string;

  @HostBinding('attr.aria-describedby') public describedBy: string = '';

  public get value(): string {
    return this.editorControl.value;
  }

  public set value(newValue: string) {
    this.writeValue(newValue);
  }

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(newPlaceholder: string) {
    this._placeholder = newPlaceholder;
    this.stateChanges.next();
  }

  private _placeholder: string;

  public focused: boolean = false;

  public get empty(): boolean {
    return !!this.editorControl.value;
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(isRequired: boolean) {
    this._required = coerceBooleanProperty(isRequired);
    this.stateChanges.next();
  }

  private _required: boolean = false;

  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(isDisabled: boolean) {
    this.setDisabledState(isDisabled);
  }

  private _disabled: boolean = false;

  public shouldPlaceholderFloat: boolean = false;

  public readonly controlType: string = 'mat-ngx-wig';

  private _destroy$$: Subject<void> = new Subject<void>();

  public editorControl: FormControl = new FormControl();

  public constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    private _focusMonitor: FocusMonitor,
    private _elRef: ElementRef,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    if (ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this._focusMonitor.monitor(this._elRef.nativeElement, true)
      .subscribe((origin: string) => {
        this.focused = !!origin;

        if (!this.focused) {
          this._onTouched();
        }

        this.stateChanges.next();
      });

    this.editorControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(() => this.editorControl.enabled),
        takeUntil(this._destroy$$)
      )
      .subscribe((newValue: string) => {
        this._onChange(newValue);
      });
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  public ngOnChanges(): void {
    this.stateChanges.next();
  }

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick(event: MouseEvent): void { }

  public writeValue(newValue: string): void {
    this.editorControl.setValue(newValue, { emitEvent: false });
    this.stateChanges.next();
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = coerceBooleanProperty(isDisabled);

    if (this._disabled) {
      this.editorControl.disable();
    } else {
      this.editorControl.enable();
    }

    this.stateChanges.next();
  }

  public ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();

    this.stateChanges.complete();

    this._focusMonitor.stopMonitoring(this._elRef.nativeElement);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  private _onChange: (value: string) => void = () => {};
  private _onTouched = () => {};
}
