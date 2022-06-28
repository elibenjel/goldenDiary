import React from "react";
import { Box, useTheme } from "native-base";
import { Platform } from "react-native";
import DatePicker from 'react-native-datepicker';
import { FormControlledInput } from "./FormControlledInput";

const MyDatePicker = (props) => {
  const { date, onChange, ...other } = props;
  const { colors, fontSizes } = useTheme();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const leftZeroPadding = (n) => `${n < 10 ? '0' : ''}${n}`;
  const dateStr = `${year}-${leftZeroPadding(month)}-${leftZeroPadding(day)}`;
  const onInput = (e, d) => {
    if (d === undefined) return;
    const [year, month, day] = d.split('-').map(str => Number(str));
    onChange(new Date(year, month-1, day));
  }

  return (
    <Box alignItems="center" {...other}>
    {
      Platform.OS !== 'web' ?
        <DatePicker
          locale='fr'
          date={dateStr}
          mode="date"
          placeholder="Choisir la date"
          format="DD-MM-YYYY"
          confirmBtnText="Confirmer"
          cancelBtnText="Annuler"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 6,
              marginLeft: 0,
              width: 28,
              height: 28
            },
            dateInput: {
              marginLeft: 36,
              height: 30,
              borderRadius: 4,
              borderColor: `${colors.coolGray[200]}`
            },
            dateText: {
              fontSize: fontSizes.xs
            }
          }}
          onDateChange={(d) => onInput(null, d)}
        />
      :
      <input type="date" value={date} onInput={onInput} style={{
        appearance: 'none',
        '-webkit-appearance': 'none',
        color: colors.coolGray[400],
        fontSize: fontSizes.xs,
        border: `2px solid #ecf0f1`,
        borderRadius: '6px',
        background: colors.light[50],
        padding: '4px',
        height: 22,
        marginTop: 4
      }} />
    }
    </Box>
  )
}

export const FormControlledDatePicker = (props) => {
  const { label, state, labelLeftIcon, errorMessage, ...datePickerProps } = props;
  const [date, setDate] = state;
  return (
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      _ios={{ mt : 1 }} _web={{ mt : -1}} w={'100%'} errorMessage={errorMessage} value={date}
    >
      <MyDatePicker date={date} onChange={(date) => setDate(date)} {...datePickerProps} />
    </FormControlledInput>
  )
}