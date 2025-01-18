export interface ColumnData {

    Model: any;
    Column: any;
    Service: any;
    AvailableEnumerations: any[];
    ModelName: string;
    ColumnName: string;
    ServiceName: string;
    EnumerationNames: string[];
    ServiceId: string;
    ModelId: string;
    ColumnId: string;

    Name: string;
    Description: string;
    DataType: string;
    Nullable: boolean;
    DefaultValue: string;
    Unique: boolean;
    Input: string;
    RequiredInput: boolean;
    Output: string;
    Editable: boolean;
    Index: boolean;
    ValidationType: string;
    DataSize: number;
    Min: number;
    Max: number;
    Queriable: boolean;
    AllowPartialStringSearch: boolean;
    Sortable: boolean;
    SearchOutput: string;
    OutputAsObject: boolean;
    Example: string;
    Keywords: string[];
    KeywordsStr: string;
    EnumerationName: string;
    EnumerationId: string | null | undefined;
}

export class ColumnFormDataHandler {

    _orig : ColumnData;
    _curr : ColumnData;
    _data : any;

    constructor() {
    }
    
    saveServerData = (pagerServerData: any) =>  {

        this._data = pagerServerData;

        const model = this._data.entity;
        const column = this._data.column;
        const service = this._data.service;

        this._curr.Model   = model;
        this._curr.Column  = column;
        this._curr.Service = service;

        this._curr.AvailableEnumerations = this._data.enumerations ?? [];
        
        this._curr.ModelName        = model.name;
        this._curr.ColumnName       = this._curr.Column.name;
        this._curr.ServiceName      = this._curr.Service.name;
        this._curr.EnumerationNames = this._curr.AvailableEnumerations.map((x: any) => x.Name);
        this._curr.ServiceId        = this._curr.Service.Id;
        this._curr.ModelId          = this._curr.Model.Id;
        this._curr.ColumnId         = this._curr.Column.Id;

        this._curr.Name           = column.name;
        this._curr.Description    = column.description ?? '';
        this._curr.DataType       = column.dataType ?? 'string';
        this._curr.Nullable       = column.nullable ?? true;
        this._curr.DefaultValue   = column.defaultValue ?? '';
        this._curr.Unique         = column.unique ?? false;
        this._curr.Input          = column.input ?? true;
        this._curr.RequiredInput  = column.requiredInput ?? true;
        this._curr.Output         = column.output ?? true;
        this._curr.Editable = column.editable ?? false;
        this._curr.Index = column.index ?? false;

        this._curr.ValidationType = column.validationType ?? 'None';
        this._curr.DataSize = column.dataSize ?? 64;
        this._curr.Min = column.min ?? 0;
        this._curr.Max = column.max ?? 64;

        this._curr.Queriable = column.queriable ?? true;
        this._curr.AllowPartialStringSearch = column.allowPartialStringSearch ?? true;
        this._curr.Sortable = column.sortable ?? true;
        this._curr.SearchOutput = column.searchOutput ?? true;
        this._curr.OutputAsObject = column.outputAsObject ?? false;

        this._curr.EnumerationName = column.enumerationName ?? '';
        this._curr.Example = column.example ?? '';
        this._curr.Keywords = column.keywords ?? [];
        this._curr.KeywordsStr = column.keywords.join(', ');

        this._curr.EnumerationId = this.getEnumId(this._curr.EnumerationName);

        this._orig = this.set(this._curr, this._orig);
    }

    reset () {
        this._curr = this.set(this._orig, this._curr);
    }

    private set(from: ColumnData, to: ColumnData) {
        to.Name                     = from.Name;
        to.Description              = from.Description;
        to.DataType                 = from.DataType;
        to.Nullable                 = from.Nullable;
        to.DefaultValue             = from.DefaultValue;
        to.Unique                   = from.Unique;
        to.Input                    = from.Input;
        to.RequiredInput            = from.RequiredInput;
        to.Output                   = from.Output;
        to.Editable                 = from.Editable;
        to.Index                    = from.Index;
        to.ValidationType           = from.ValidationType;
        to.DataSize                 = from.DataSize;
        to.Min                      = from.Min;
        to.Max                      = from.Max;
        to.Queriable                = from.Queriable;
        to.AllowPartialStringSearch = from.AllowPartialStringSearch;
        to.Sortable                 = from.Sortable;
        to.SearchOutput             = from.SearchOutput;
        to.OutputAsObject           = from.OutputAsObject;
        to.Example                  = from.Example;
        to.Keywords                 = from.Keywords;
        to.KeywordsStr              = from.KeywordsStr;
        to.EnumerationName          = from.EnumerationName;
        to.EnumerationId            = from.EnumerationId;

        return to;
    }

    getEnumId(name: string): string | null | undefined {
        const x = this._curr.AvailableEnumerations.find((e) => e.name === name);
        return x ? x.id : null;
    }

}
