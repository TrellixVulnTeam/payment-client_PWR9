## Usage

### Simple Select

const {
  selected: selectedProviders,
  onChange: onChangeProviders,
  unselectAll: unselectAllProviders,
} = useCheckbox(providerIds, providerOptions, (data) => handleSelectProviders(data));

const handleSelectProviders = (providerIds = []) => {};

<MultipleSelect
  placeholder="Placeholder"
  selected={selectedProviders}
  onChange={onChangeProviders}
  onClear={unselectAllProviders}
>
  {providerOptions.map((value, idx) => (
    <MultipleSelectOption key={value} value={value}>
      {PROVIDERS.find((x) => x.value.toString() === value).name}
    </MultipleSelectOption>
  ))}
</MultipleSelect>