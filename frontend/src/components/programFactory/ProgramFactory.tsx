import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { Button } from '../ui/button'

export const ProgramFactory = () => {
  const [pageNumber, setPageNumber] = useState<number>(0)

  return (
    <div className="flex flex-col">
      {pageNumber === 0 ? (
        <div>What are your fitness goals</div>
      ) : pageNumber === 1 ? (
        <div>Years of experience working out</div>
      ) : pageNumber === 2 ? (
        <div>How many days can you work out in a week</div>
      ) : pageNumber === 3 ? (
        <div>Age Weight and Gender</div>
      ) : (
        <div>Summary</div>
      )}
      <div className="flex flex-row justify-between">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setPageNumber((prevPage) => prevPage - 1)}
        >
          Back
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => setPageNumber((prevPage) => prevPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
