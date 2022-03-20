(() => {
  const addBtn = document.getElementById('addBtn');
  const removeBtn = document.getElementById('removeBtn');

  addBtn && addBtn.addEventListener('click', addIngredientRow);
  removeBtn && removeBtn.addEventListener('click', removeIngredientRow);
  M && document.addEventListener('DOMContentLoaded', loadSelects);

  function loadSelects() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, []);
  }

  function addIngredientRow() {
    const inputContainer = document.getElementById('inputs');
    inputContainer.insertAdjacentHTML('beforeend', createInputRow(inputContainer.childElementCount, getSelectOptions()));
    loadSelects();
  }

  function removeIngredientRow() {
    const inputContainer = document.getElementById('inputs');
    if (inputContainer.childElementCount === 1) return;
      inputContainer.removeChild(inputContainer.lastElementChild);
  }

  function getSelectOptions() {
    const select = document.querySelector('select');
    return [...select.options].map((option) => ({
      id: option.value,
      name: option.text,
    }));
  }

  function createInputRow(index, options) {
    return `<div class="row">
<div class="input-field col s4">
    <input required id="ingredient${index}" name="ingredients[${index}]" type="text">
    <label for="ingredient${index}">Ingredient</label>
</div>
<div class="input-field col s4">
    <select name="measures[${index}]" >
        ${options.map((o) => `<option value="${o.id}">${o.name}</option>`)}
    </select>
    <label>Measure</label>
</div>
<div class="input-field col s4">
    <input type="number" name="amounts[${index}]" id="amounts${index}">
    <label for="amounts${index}">amount</label>
</div>
</div> `;
  }
})();