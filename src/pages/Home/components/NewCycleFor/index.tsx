import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { 
  FormContainer, 
  MinutesAmoutInput, 
  TaskInput 
} from "./styles";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return(
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput 
        disabled={!!activeCycle}
        type="text" 
        id="task" 
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestion"
        {...register('task')}
      />
      <datalist id="task-suggestion">
        <option value="projeto 1"></option>
        <option value="projeto 2"></option>
        <option value=""></option>
        <option value=""></option>
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmoutInput 
        disabled={!!activeCycle}
        type="number" 
        id="minutesAmount" 
        placeholder="00"
        step={5}
        min={5}
        max={60}
        {...register('minutesAmount', {valueAsNumber: true})}
      />

      <span>minutes.</span>
    </FormContainer>
  )
}