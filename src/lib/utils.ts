export function testFilter(filter: string | null): "all-task" | "my-task" {
  const DEFAULT_FILTER = "all-task";
  const validFilters = ["all-task", "my-task"];

  // cast to default filter if filter null
  const filterToCheck = filter || DEFAULT_FILTER;
  const isValidFilter = validFilters.includes(filterToCheck);
  const testedFilter = isValidFilter ? filterToCheck : DEFAULT_FILTER;

  return testedFilter as "all-task" | "my-task";
}
