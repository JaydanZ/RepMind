import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Label } from '../ui/label'

export const ProgramResult = () => {
  const programData = useSelector(
    (state: RootState) => state.programGeneration.aiProgram
  )
  return (
    <div className="flex flex-col justify-center items-center">
      <Label className="text-[3rem] mb-10 font-thin">Your Program</Label>
      <div className="flex flex-row">
        {programData?.program_structure?.map((workout, index) => (
          <div key={index}>
            <div>{workout.day}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
