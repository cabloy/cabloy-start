import type { ServiceAppModal } from '../service/appModal.ts';
import type { IModalItem } from '../types/appModal.ts';

export class AppModalItem {
  private serviceAppModal: ServiceAppModal;
  private modalItem: IModalItem;

  constructor(serviceAppModal: ServiceAppModal, modelItem: IModalItem) {
    this.serviceAppModal = serviceAppModal;
    this.modalItem = modelItem;
  }

  public close() {
    this.serviceAppModal.close(this.modalItem.id);
  }
}
