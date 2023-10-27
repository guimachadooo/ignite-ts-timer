import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmount, 
  Separator, 
  StartCountdown, 
  TaskInput
} from './styles';

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe uma tarefa'),
  minutesAmount: zod.number().min(5).max(60)
});

type CycleFormData = zod.infer<typeof newCycleValidationSchema>

export function Home(){
  const { register, handleSubmit, watch, reset } = useForm<CycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });
  
  let task = watch('task');
  let isSubmitDisabled = !task;
  
  let handleTask = (data: any) => {
    console.log(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleTask)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
  
          <TaskInput 
            id="task"
            placeholder="Dê um nome para o seu projeto" 
            list="task-suggestions"
            {...register('task')}
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
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdown type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdown>
      </form>
    </HomeContainer>
  )
}