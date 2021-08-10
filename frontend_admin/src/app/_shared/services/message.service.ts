import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private toastr: ToastrService) { }

  showSessionExpired() {
    this.toastr.warning('La sesión a expirado.', 'Alerta');
  }

  showUserUnathorized() {
    this.toastr.warning('Usuario no autorizado', 'Alerta');
  }

  showSuccessRegister() {
    this.toastr.success('Registro guardado con éxito', 'Exitoso');
  }

  showSuccessDelete() {
    this.toastr.success('Registro eliminado con éxito.', 'Exitoso');
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Exitoso');
  }

  showError(error: string) {
    this.toastr.error(error, 'Error');
  }

  showWarning(error: string) {
    this.toastr.warning(error, 'Alerta');
  }
}

