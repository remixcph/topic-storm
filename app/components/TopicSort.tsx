import { useSearchParams, useSubmit, Form } from "@remix-run/react";
import { clsx } from "clsx";

const topicSortingOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most liked", value: "most-liked" },
  { label: "Most commented", value: "most-commented" },
];

export const TopicSorter = () => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const isOptionSelected = (option: { value: string; label: string }) => {
    // default
    if (!searchParams.get("sort-topics")) return option.value === "newest";

    return searchParams.get("sort-topics") === option.value;
  };

  return (
    <Form
      method="get"
      onChange={(e) => submit(e.currentTarget)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap gap-2">
        {topicSortingOptions.map((option) => (
          <div key={option.label}>
            <input
              type="radio"
              className="hidden"
              name={`sort-topics`}
              id={`sort-option-${option.value}`}
              value={option.value}
            />
            <label
              className={clsx(
                "cursor-pointer whitespace-nowrap rounded bg-white py-1 px-2 text-sm",
                {
                  "bg-black text-white": isOptionSelected(option),
                }
              )}
              htmlFor={`sort-option-${option.value}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </Form>
  );
};
