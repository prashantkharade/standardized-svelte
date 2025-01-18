export const errors = {
    FirstName: '',
    LastName: '',
    CountryCode: '',
    Phone: '',
    Email: '',
    Username: '',
    Password: ''
};

export interface ProfileFormData {
    FirstName: string;
    LastName: string;
    CountryCode: string;
    Phone: string;
    Email: string;
    Username: string;
    Password: string;
}

export class FormDataHandler {
    _originalData: ProfileFormData;
    _currentData: ProfileFormData;

    constructor(initialData: ProfileFormData) {
        this._originalData = { ...initialData };
        this._currentData = { ...initialData };
    }

    setData(newData: ProfileFormData) {
        this._currentData = { ...newData };
        this._originalData = { ...newData };
    }

    resetData() {
        // console.log('originalData', this._originalData);
        this._currentData = { ...this._originalData };
    }
}
