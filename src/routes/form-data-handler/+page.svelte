<!--//Form page.svelte 'script' section structure 

    // Importing required modules
    // Getting page server data
    // Page title setting
    // Define form variable
    // Page params based values
    // Define Form data handler
    // Define init function
    // On mount function
    // After navigate function
    // Update breadcrumbs function
    // Define reactive staments (In Svelte 5, define them through Runes)



<script lang="ts">
    import { page } from '$app/stores';
    import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
    import type { PageServerData } from './$types';
    import { enhance } from '$app/forms';
    import { CaseConverter } from '$lib/utils/case.converter';
    import { columnDataTypes, stringValidationTypes } from '$lib/types/column.enums';
    import type { EnumerationValue } from '$lib/data.types/service.types';
    import Checkbox from '$lib/components/modals/Checkbox.svelte';
    import TextInput from '$lib/components/modals/TextInput.svelte';
    import NumberInput from '$lib/components/modals/NumberInput.svelte';
    import InputChips from '$lib/components/Input-Chips.svelte';
    import Select from '$lib/components/modals/Select.svelte';
    import Visible from '$lib/components/Visible.svelte';
    import HorizontalSeparator from '$lib/components/modals/HorizontalSeparator.svelte';
    import Icon from '@iconify/svelte';
    import { afterNavigate } from '$app/navigation';
    import { ColumnData, ColumnFormDataHandler } from './colum.data';
    import { onMount } from 'svelte';

    export let data: PageServerData;

    data.title = 'View';
    
    export let form: any;

    // Page params based values
    let userId = $page.params.userId;
    let serviceId = $page.params.serviceId;
    let modelId = $page.params.modelId;
    let columnId = $page.params.columnId;

    let keywords: string[] = [];

    // Form data handler - Assign page server data
    let fdh: ColumnFormDataHandler = new ColumnFormDataHandler();

    const updateBreadcrumbs = () => {
        // Paths
        var homePath = `/users/${userId}/home`;
        var servicesPath = `/users/${userId}/services`;
        var servicePath = `${servicesPath}/${serviceId}`;
        var modelsPath = `${servicePath}/models`;
        var modelPath = `${modelsPath}/${modelId}`;
        var columnsPath = `${modelPath}/columns`;

        var serviceName = fdh._curr.ServiceName;
        var modelName = fdh._curr.ModelName;
        var columnName = fdh._curr.Name;

        var breadCrumbs = [
            { name: 'Home', path: homePath },
            { name: 'Services', path: servicesPath },
            { name: serviceName, path: servicePath },
            { name: 'Models', path: modelsPath },
            { name: modelName, path: modelPath },
            { name: 'Columns', path: columnsPath },
            { name: columnName, path: null }
        ];
    }

    const init = () => {
        userId = $page.params.userId;
        fdh.saveServerData(data);
        keywords = fdh._curr.Keywords ?? [];
        updateBreadcrumbs();
    }

    onMount(() => {
        init();
    });

    afterNavigate(({from, to}) => {
        // Check if the column (slug) has changed, but path remains same
        init();
    });

    const reset = () => {
        fdh.reset();
    };

    const onNameChange = (e: Event) => {
        fdh._curr.Name = (e.target as HTMLInputElement).value;
        fdh._curr.Name = CaseConverter.pascalCase(fdh._curr.Name);
        if (fdh._curr.Name.length < 3) {
            return;
        }
    };

    const onEnumChange = (e: Event) => {
        const enumeration = fdh._curr.AvailableEnumerations.find((e) => e.name === fdh._curr.EnumerationName);
        if (enumeration) {
            enumerationId = enumeration.id;
        }
    };

    const onDataSizeChange = (e: Event) => {
        fdh._curr.DataSize = parseInt((e.target as HTMLInputElement).value);
        fdh._curr.DataSize = fdh._curr.DataSize < 1 ? 1 : fdh._curr.DataSize;
        fdh._curr.Max = fdh._curr.DataSize;
    };

    const onMinChange = (e: Event) => {
        fdh._curr.Min = parseInt((e.target as HTMLInputElement).value);
        fdh._curr.Min = fdh._curr.Min < 0 ? 0 : fdh._curr.Min;
        fdh._curr.Min = fdh._curr.Min > fdh._curr.Max ? fdh._curr.Max : fdh._curr.Min;
    };

    const onMaxChange = (e: Event) => {
        fdh._curr.Max = parseInt((e.target as HTMLInputElement).value);
        fdh._curr.Max = fdh._curr.Max < 1 ? 1 : fdh._curr.Max;
        fdh._curr.Max = fdh._curr.Max < fdh._curr.Min ? fdh._curr.Min : fdh._curr.Max;
        fdh._curr.Max = fdh._curr.Max > fdh._curr.DataSize ? fdh._curr.DataSize : fdh._curr.Max;
    };

    const onUpdateKeywords = (e: any) => {
        console.log('Keywords = ', e.detail);
        keywords = e.detail;
        fdh._curr.KeywordsStr = fdh._curr.Keywords?.join(', ');
        // console.log(JSON.stringify(e, null, 2));
    };

    const onAdvancedClick = (e: any) => {
        e.preventDefault();
        console.log('Advanced Clicked');
        showAdvanced_ = !showAdvanced_;
    };

    $: enumerationId = fdh.getEnumId(enumerationName);
    enumerationId_ = enumerationId;

    let showAdvanced_ = false;

    $: enableDatasize = dataType === 'String' || dataType === 'Long String';

    $: showValidation =
        fdh._currentData.dataType === 'String' ||
        dataType === 'Long String' ||
        dataType === 'Integer' ||
        dataType === 'Float' ||
        dataType === 'Double';

    $: validationType = showValidation ? validationType : 'None';

    $: showMinMax =
        dataType === 'String' ||
        dataType === 'Long String' ||
        dataType === 'Integer' ||
        dataType === 'Float' ||
        dataType === 'Double';

    $: inputValidationTypes = dataType === 'String' || dataType === 'Long String' ? stringValidationTypes : ['None'];
    $: maxLabel = dataType === 'String' || dataType === 'Long String' ? 'Maximum length' : 'Maximum Value';
    $: minLabel = dataType === 'String' || dataType === 'Long String' ? 'Minimum length' : 'Minimum Value';

</script>

<div class="max-w-screen-xl mx-auto flex flex-col gap-4 p-6 shrink-0">
    <BreadCrumbs crumbs={breadCrumbs} />

    <form
        action="?/updateColumnAction"
        class="flex flex-col gap-2 p-2"
        method="post"
        use:enhance
    >
        <div class="form-control">
            <label
                class="label"
                for="name"
            >
                <span class="label-text">Name *</span>
            </label>
            <input
                type="text"
                placeholder="Type here"
                class="input"
                name="name"
                id="name"
                bind:value={fdh._curr.Name}
                on:input={onNameChange}
                required
            />
            {#if form?.validationErrors?.name}
                <p class="text-red-500 text-sm">{form?.validationErrors?.name[0]}</p>
            {/if}
        </div>

        <div class="py-1" />
        <HorizontalSeparator title="Date Type" />
        <div class="py-1" />

        <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div class="form-control grow">
                <Select
                    icon="mdi:format-list-bulleted"
                    name="dataType"
                    label="Column Data Type"
                    tooltip="Select the data type for this column."
                    bind:value={dataType}
                    options={columnDataTypes}
                />
            </div>

            <Visible visible={dataType === 'Enum'}>
                {#if fdh._curr.AvailableEnumerations.length === 0}
                    <div class="form-control grow">
                        <div class="flex felx-row">
                            <div class="grow w-full">
                                <a
                                    href={`/users/${userId}/enumerations/new`}
                                    class="btn btn-sm btn-primary"
                                >
                                No enumerations found! Create One
                                </a>
                            </div>
                        </div>
                    </div>
                {:else}
                    <div class="form-control grow">
                        <Select
                            icon="mdi:format-list-bulleted"
                            name="enumerationName"
                            label="Enum Name (List of possible values)"
                            tooltip="Select the enumeration name from existing enums."
                            options={enumerationNames}
                            bind:value={enumerationName}
                            on:change={onEnumChange}
                        />
                    </div>
                {/if}
            </Visible>
            <input
                type="hidden"
                name="enumerationId"
                id="enumerationId"
                bind:value={enumerationId}
            />

            <div class="form-control grow">
                <Checkbox
                    icon="fluent-mdl2:field-required"
                    name="required"
                    label="Nullable (Allow Null)"
                    tooltip="Is it necessary to set this value? Or can it be null?"
                    bind:checked={nullable}
                />
            </div>

            <div class="form-control grow">
                <TextInput
                    icon="healthicons:default-outline"
                    name="defaultValue"
                    label="Default Value"
                    tooltip="Default value for this column."
                    bind:value={defaultValue}
                />
            </div>

            <div class="form-control grow">
                <Checkbox
                    icon="emojione-monotone:index-pointing-up"
                    name="unique"
                    label="Unique"
                    tooltip="The unique attribute specifies whether the column is a unique key. This constraint makes sure that all values in a column are different."
                    bind:checked={unique}
                />
            </div>
            <div class="form-control grow">
                <Checkbox
                    icon="mdi:input"
                    name="input"
                    label="Input"
                    tooltip="Is this column an input?"
                    bind:checked={input}
                />
            </div>

            <Visible visible={input}>
                <div class="form-control grow">
                    <Checkbox
                        icon="mdi:input"
                        name="requiredInput"
                        label="Required Input"
                        tooltip="Is this column us required input?"
                        bind:checked={requiredInput}
                    />
                </div>
                <div class="form-control grow">
                    <Checkbox
                        icon="mdi:edit"
                        name="editable"
                        label="Editable"
                        tooltip="Is this column editable?"
                        bind:checked={editable}
                    />
                </div>
            </Visible>

            <div class="form-control grow">
                <Checkbox
                    icon="mdi:output"
                    name="output"
                    label="Output"
                    tooltip="Is this column a default output?"
                    bind:checked={output}
                />
            </div>

            <div class="form-control grow">
                <Checkbox
                    icon="oui:index-mapping"
                    name="index"
                    label="Index"
                    tooltip="Is this column indexed?"
                    bind:checked={index}
                />
            </div>
        </div>

       
        <div
            class="btn btn-sm btn-outline mr-auto my-4"
            on:keydown={onAdvancedClick}
            on:click={onAdvancedClick}
        >
            <div class="flex flex-row items-center gap-2">
                <span>Advanced Options</span>
                {#if showAdvanced_}
                    <Icon
                        icon="mdi:chevron-up"
                        class="text-xl"
                    />
                {:else}
                    <Icon
                        icon="mdi:chevron-down"
                        class="text-xl"
                    />
                {/if}
            </div>
        </div>

        <Visible visible={showAdvanced_}>
            {#if showValidation}
                <div class="py-1" />
                <HorizontalSeparator title="Validation" />
                <div class="py-1" />

                <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
                    <div class="form-control grow">
                        <Select
                            icon="grommet-icons:validate"
                            name="validationType"
                            label="Validation Type"
                            options={inputValidationTypes}
                            tooltip="Select the validation type for this column. If not sure, select None."
                            bind:value={validationType}
                        />
                    </div>

        
                    <Visible visible={enableDatasize}>
                        <div class="form-control grow">
                            <NumberInput
                                icon="mdi:numeric"
                                name="dataSize"
                                label="Data Size"
                                tooltip="Data size for this column."
                                bind:value={fdh._curr.DataSize}
                                enabled={enableDatasize}
                                on:change={onDataSizeChange}
                            />
                        </div>
                    </Visible>

                    <Visible visible={showMinMax}>
                        <div class="form-control grow">
                            <NumberInput
                                icon="fluent-mdl2:minimum-value"
                                name="min"
                                label={minLabel}
                                tooltip="Minimum value/length allowed."
                                bind:value={fdh._curr.Min}
                                on:change={onMinChange}
                            />
                        </div>

                        <div class="form-control grow">
                            <NumberInput
                                icon="fluent-mdl2:maximum-value"
                                name="max"
                                label={maxLabel}
                                tooltip="Maximum value/length allowed."
                                bind:value={fdh._curr.Max}
                                on:change={onMaxChange}
                            />
                        </div>
                    </Visible>
                </div>
            {/if}

 

            <div class="py-1" />
            <HorizontalSeparator title="Output and Search" />
            <div class="py-1" />

            <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
                <Visible visible={output}>
                    <div class="form-control grow">
                        <Checkbox
                            icon="mdi:search"
                            name="searchOutput"
                            label="Search Output"
                            tooltip="Is this column a search output?"
                            bind:checked={searchOutput}
                        />
                    </div>
                    <div class="form-control grow">
                        <Checkbox
                            icon="mdi:json"
                            name="outputAsObject"
                            label="Output As Object"
                            tooltip="Output this column as an object?"
                            bind:checked={outputAsObject}
                        />
                    </div>
                    <div class="form-control grow">
                        <Checkbox
                            icon="mdi:sort"
                            name="sortable"
                            label="Sortable"
                            tooltip="Is this column sortable?"
                            bind:checked={sortable}
                        />
                    </div>
                </Visible>

                <div class="form-control grow">
                    <Checkbox
                        icon="mdi:filter-outline"
                        name="queriable"
                        label="Queriable"
                        tooltip="Is this column queriable? If checked, this column will be used as a filter."
                        bind:checked={queriable}
                    />
                </div>

                <Visible visible={queriable}>
                    <div class="form-control grow">
                        <Checkbox
                            icon="f7:pencil-ellipsis-rectangle"
                            name="allowPartialStringSearch"
                            label="Partial String Search"
                            tooltip="Allow partial string search?"
                            bind:checked={allowPartialStringSearch}
                        />
                    </div>
                </Visible>
            </div>

            <div class="py-1" />
            <HorizontalSeparator title="Additional Information" />

            <div class="form-control">
                <label
                    class="label"
                    for="description"
                >
                    <span class="label-text">Description</span>
                </label>
                <textarea
                    class="textarea"
                    placeholder="Type here"
                    name="description"
                    id="description"
                    bind:value={description}
                />
                {#if form?.validationErrors?.description}
                    <p class="text-red-500 text-sm">{form?.validationErrors?.description[0]}</p>
                {/if}
            </div>

            <div class="form-control">
                <label
                    class="label"
                    for="example"
                >
                    <span class="label-text">Example</span>
                </label>
                <input
                    type="text"
                    placeholder="Type here"
                    class="input"
                    name="example"
                    id="example"
                    bind:value={example}
                    required
                />
            </div>
        </Visible>

        <div class="form-control">
            <label
                class="label"
                for="keywords"
            >
                <span class="label-text">Keywords</span>
                <span class="label-text-alt">Press Enter to add new.</span>
            </label>
            <InputChips
                bind:keywords
                name="keywords"
                id="keywords"
                on:keywordsChanged={onUpdateKeywords}
            />
            <input
                type="hidden"
                name="keywordsStr"
                id="keywordsStr"
                bind:value={fdh._curr.KeywordsStr}
            />
        </div>

        <div class="flex flex-row-reverse gap-2">
            <button
                type="submit"
                class="btn btn-sm btn-primary px-6">Submit</button
            >
            <button
                type="button"
                on:click={reset}
                class="btn btn-sm btn-outline btn-primary px-6">Reset</button
            >
        </div>
    </form>
</div> -->
