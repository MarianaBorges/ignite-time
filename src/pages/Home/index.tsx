import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HandPalm, Play } from "@phosphor-icons/react";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { 
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton 
} from "./styles";
import { NewCycleForm } from "./components/NewCycleFor";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1,"Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo deve ter no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
  const { activeCycle, createNewClicle, interruptCycle } = useContext(CyclesContext)
  const cycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset } = cycleForm

  function hendleCreateNewCycle(data: NewCycleFormData) {
    createNewClicle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(hendleCreateNewCycle)}>
        <FormProvider {...cycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        { activeCycle ? (
          <StopCountdownButton onClick={interruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ):(
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}