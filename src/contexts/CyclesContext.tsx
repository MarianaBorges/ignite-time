import { 
  createContext, 
  ReactNode, 
  useEffect, 
  useReducer, 
  useState 
} from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { 
  addNewCycleAction, 
  interruptCycleAction, 
  markCurrentCycleAsFinishedAction 
} from "../reducers/cycles/actions";

interface createNewClicleProps {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewClicle: (data: createNewClicleProps) => void;
  interruptCycle: () => void;
}

interface CyclesProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesProvider({children}: CyclesProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null
  }, (initialState) => {
    const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

    if (storedStateAsJSON) {
      return JSON.parse(storedStateAsJSON)
    }

    return initialState
  })
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  
  const {cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number){
    setAmountSecondsPassed(seconds)
  }

  function createNewClicle(data: createNewClicleProps){
    const id = String(new Date().getTime());
    const newCycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCycle() {
    dispatch(interruptCycleAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  useEffect(()=> {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])
  
  return (
    <CyclesContext.Provider value={{ 
      cycles,
      activeCycle, 
      activeCycleId, 
      amountSecondsPassed,
      markCurrentCycleAsFinished,
      setSecondsPassed,
      createNewClicle,
      interruptCycle,
    }}>
      {children}
    </CyclesContext.Provider>
  )
}