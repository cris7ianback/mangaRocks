import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'info';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private readonly defaultDuration = 3000;

    constructor(private readonly snackBar: MatSnackBar) { }

    open(
        message: string,
        type: SnackbarType = 'info',
        action = 'Cerrar',
        duration: number = this.defaultDuration,
        config?: MatSnackBarConfig
    ) {
        const panelClass = this.getPanelClass(type);

        this.snackBar.open(message, action, {
            duration,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass,
            ...config,
        });
    }

    private getPanelClass(type: SnackbarType): string[] {
        switch (type) {
            case 'success': return ['snackbar-success'];
            case 'error': return ['snackbar-error'];
            case 'info':
            default: return ['snackbar-info'];
        }
    }
}
