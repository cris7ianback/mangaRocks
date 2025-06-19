import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
        if (!window.electronAPI) {
            return { success: false, message: 'API de Electron no disponible.' };
        }
        return await window.electronAPI.login({ username, password });
    }
}
