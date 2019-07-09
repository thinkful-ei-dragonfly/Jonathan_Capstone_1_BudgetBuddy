import React from 'react'
import './BudgetBuddyForm.css'

export default function BudgetBuddyForm(props){
  const { className, ...otherProps } = props
  return(
    <form
    className={['BudgetBuddy-form', className].join(' ')}
    action='#'
    {...otherProps}
    />
  )
}