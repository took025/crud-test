import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeWhile } from "rxjs";
import { User } from "src/app/core/interface";
import { MainService } from "src/app/core/main.service";
import { onlyLettersRegex } from "src/app/core/validation";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent {
  addUserForm: FormGroup;
  usersList: User[];
  isAlive = true;
  editMode: boolean;
  selectedUser: User;
  modalOptions: NgbModalOptions = {
    backdrop: "static",
    backdropClass: "customBackdrop",
    modalDialogClass: "modal-dialog-centered",
  };
  constructor(
    private mainServie: MainService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.addUserForm = new FormGroup({
      firstName: new FormControl("", [Validators.required, onlyLettersRegex]),
      lastName: new FormControl("", [Validators.required , onlyLettersRegex]),
      gender: new FormControl("", [Validators.required]),
    });
    this.getData();
  }

  getData() {
    this.mainServie
      .getData()
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((res: User[]) => {
        this.usersList = res;
      });
  }

  trackByFn(user: any, item: any) {
    return user.id;
  }

  deleteUser(user: User) {
    this.mainServie
      .deleteUser(user._id)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(
        (res) => {
          this.getData();
        },
        (error: any) => {
          console.log(error.statusText);
        }
      );
  }

  editUser(user: User) {
    this.selectedUser = user;
  }

  openModal(content: any, mode: boolean, user?: User) {
    this.editMode = mode;
    if (user) {
      this.selectedUser = user;
    }
    this.modalService.open(content, this.modalOptions);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
