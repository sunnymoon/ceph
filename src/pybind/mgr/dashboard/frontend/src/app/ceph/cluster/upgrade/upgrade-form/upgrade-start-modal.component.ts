import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Icons } from '~/app/shared/enum/icons.enum';
import { Permission } from '~/app/shared/models/permissions';
import { ActionLabelsI18n } from '~/app/shared/constants/app.constants';
import { AuthStorageService } from '~/app/shared/services/auth-storage.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpgradeService } from '~/app/shared/api/upgrade.service';
import { UpgradeInfoInterface } from '~/app/shared/models/upgrade.interface';
import { NotificationType } from '~/app/shared/enum/notification-type.enum';
import { CdFormGroup } from '~/app/shared/forms/cd-form-group';
import { NotificationService } from '~/app/shared/services/notification.service';

@Component({
  selector: 'cd-upgrade-start-modal.component',
  templateUrl: './upgrade-start-modal.component.html',
  styleUrls: ['./upgrade-start-modal.component.scss']
})
export class UpgradeStartModalComponent implements OnInit {
  permission: Permission;
  upgradeInfoError$: Observable<any>;
  upgradeInfo$: Observable<UpgradeInfoInterface>;
  upgradeForm: CdFormGroup;
  icons = Icons;
  versions: string[];

  constructor(
    public actionLabels: ActionLabelsI18n,
    private authStorageService: AuthStorageService,
    public activeModal: NgbActiveModal,
    private upgradeService: UpgradeService,
    private notificationService: NotificationService
  ) {
    this.permission = this.authStorageService.getPermissions().configOpt;
  }

  ngOnInit() {
    this.upgradeForm = new CdFormGroup({
      availableVersions: new FormControl(null, [Validators.required])
    });
  }

  startUpgrade() {
    this.upgradeService.start(this.upgradeForm.getValue('availableVersions')).subscribe({
      next: () => {
        this.notificationService.show(
          NotificationType.success,
          $localize`Started upgrading the cluster`
        );
      },
      error: (error) => {
        this.upgradeForm.setErrors({ cdSubmitButton: true });
        this.notificationService.show(
          NotificationType.error,
          $localize`Failed to start the upgrade`,
          error
        );
      },
      complete: () => {
        this.activeModal.close();
      }
    });
  }
}
