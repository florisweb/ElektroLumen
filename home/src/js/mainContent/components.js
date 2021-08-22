import '../../css/mainContent/components.css';

export function Variable({name, value}) {
  return (
    <div className='Component panel variable'> 
      <div className='text name'>{name}</div>
      <div className='text value'>{value}</div>
    </div>
  )
}
