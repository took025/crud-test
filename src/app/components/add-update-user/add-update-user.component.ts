import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "src/app/core/interface";
import { MainService } from "src/app/core/main.service";
import { onlyLettersRegex } from "src/app/core/validation";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { takeWhile } from "rxjs";
@Component({
  selector: "app-add-update-user",
  templateUrl: "./add-update-user.component.html",
  styleUrls: ["./add-update-user.component.scss"],
})
export class AddUpdateUserComponent {
  addUserForm: FormGroup;
  @Input() editMode: boolean;
  @Input() user?: User;
  @Output() addSuccess: EventEmitter<any> = new EventEmitter<any>();
  errortext = null;
  isAlive = true;
  modalOptions: NgbModalOptions = {
    backdrop: "static",
    backdropClass: "customBackdrop",
    modalDialogClass: "modal-dialog-centered",
  };

  constructor(
    private mainService: MainService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.addUserForm = new FormGroup({
      firstName: new FormControl("", [Validators.required, onlyLettersRegex]),
      lastName: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required, onlyLettersRegex]),
    });
    if (this.editMode) {
      this.addUserForm.patchValue({
        firstName: this.user?.firstName,
        lastName: this.user?.lastName,
        gender: this.user?.gender,
      });
    }
  }

  onClickAdd(content: any) {
    if (this.editMode) {
      const payload = {
        id: this.user?._id,
        data: this.addUserForm.getRawValue(),
      };
      this.mainService
        .EditUser(payload)
        .pipe(takeWhile(() => this.isAlive))
        .subscribe(
          (res) => {
            this.addSuccess.emit();
            this.addUserForm.reset();
            this.errortext = null;
          },
          (error: any) => {
            this.errortext = error.statusText;
          }
        );
    } else {
      this.mainService
        .addUser(this.addUserForm.getRawValue())
        .pipe(takeWhile(() => this.isAlive))
        .subscribe(
          (res) => {
            this.addSuccess.emit();
            this.addUserForm.reset();
            this.errortext = null;
          },
          (error: any) => {
            this.errortext = error.statusText;
          }
        );
    }
    this.openModal(content);
  }

  openModal(content: any) {
    this.modalService.open(content, this.modalOptions);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
