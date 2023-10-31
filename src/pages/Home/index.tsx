import { useEffect, useState } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmount, 
  Separator, 
  StartCountdown,
  StopCountdown,
  TaskInput
} from './styles';

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe uma tarefa'),
  minutesAmount: zod.number().min(5).max(60)
});

type CycleFormData = zod.infer<typeof newCycleValidationSchema>

interface Cycle{
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptDate?: Date
}

export function Home(){
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);
  
  const { register, handleSubmit, watch, reset } = useForm<CycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  let task = watch('task');
  let isSubmitDisabled = !task;
  let totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  let currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;
  let minutesAmount = Math.floor(currentSeconds / 60);
  let secondsAmount = currentSeconds % 60;
  let minutes = String(minutesAmount).padStart(2, '0');
  let seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    let interval: number;

    if (activeCycle){
      interval = setInterval(() => {
        setSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        )
      }, 1000)
    }

    return (() => {
      clearInterval(interval);
    })
  }, [activeCycle]);

  useEffect(() => {
    if (activeCycle){
      document.title = `${minutes}:${seconds}`;
    }

  }, [minutes, seconds, activeCycle])

  function handleTask(data: CycleFormData){
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setSecondsPassed(0);

    reset();
  }

  function handleReset(){
    
    if(activeCycle){
      setCycles(cycles.map((cycle) => {
        if (cycle.id === activeCycleId){
          return { ...cycle, interruptDate: new Date()}
        }else{
          return cycle;
        }
      }))
    }

    setActiveCycleId(null);
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleTask)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
  
          <TaskInput 
            id="task"
            placeholder="Dê um nome para o seu projeto" 
            list="task-suggestions"
            {...register('task')}
            disabled={!!activeCycle}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmount 
            type="number"
            placeholder="00" 
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
            disabled={!!activeCycle}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        { activeCycle ? (
          <StopCountdown type="submit" onClick={handleReset}>
            <HandPalm size={24} />
            Interromper
          </StopCountdown>
        ) : (
          <StartCountdown type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdown>
        )}
      </form>
    </HomeContainer>
  )
}