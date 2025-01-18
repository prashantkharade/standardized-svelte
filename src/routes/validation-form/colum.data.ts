export interface ColumnData {
    ModelName: string;
    ColumnName: string;
    ColumnType: string;
    ColumnId: string;
    }

export class ColumnFormDataHandler {

    _originalData : ColumnData;
    _currentData : ColumnData;
    _pagerServerData : any;

    constructor() {
    }
    
    saveServerData = (pagerServerData: any) =>  {

        this._pagerServerData = pagerServerData;
        
        this._currentData.ModelName  = this._pagerServerData.ModelName;
        this._currentData.ColumnName = this._pagerServerData.ColumnName;
        this._currentData.ColumnType = this._pagerServerData.ColumnType;

        this._originalData.ModelName  = this._pagerServerData.ModelName;
        this._originalData.ColumnName = this._pagerServerData.ColumnName;
        this._originalData.ColumnType = this._pagerServerData.ColumnType;

    }

    reset () {
        this._currentData.ModelName  = this._originalData.ModelName;
        this._currentData.ColumnName = this._originalData.ColumnName;
        this._currentData.ColumnType = this._originalData.ColumnType;
    }

}

