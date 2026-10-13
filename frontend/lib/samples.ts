export const SAMPLE_CODE = `def solve(input_data):
    # Calculate the average of numbers
    # BUG: Crashes with ZeroDivisionError when numbers is empty []
    numbers = input_data["numbers"]
    return sum(numbers) / len(numbers)
`;

export const SAMPLE_TESTS = `[
  {
    "input": { "numbers": [2, 4, 6] },
    "expected_output": 4
  },
  {
    "input": { "numbers": [] },
    "expected_output": 0
  }
]`;

export const TEST_FORMAT_EXAMPLE = `[
  {
    "input": <any JSON value>,
    "expected_output": <any JSON value>
  }
]`;
