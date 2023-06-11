import React, { ChangeEvent, useCallback, useState } from 'react';

type UserInputProps = [string, boolean, (string) => void, () => void, () => void, () => void, () => void, (boolean) => void];

const useTextInput = (): UserInputProps => {
  const [textInputText, setTextInputText] = useState('');
  const [isFocusTextInput, setIsFocusTextInput] = useState(false);

  const onEndEdition = useCallback(() => {
    setIsFocusTextInput(false);
  }, []);

  const onChangeText = useCallback(text => {
    setTextInputText(text);
  }, []);

  const onFocus = useCallback(() => {
    setIsFocusTextInput(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocusTextInput(false);
  }, []);

  const clearTextInput = useCallback(() => {
    setTextInputText('');
  }, []);

  return [textInputText, isFocusTextInput, onChangeText, clearTextInput, onEndEdition, onFocus, onBlur, setIsFocusTextInput];
};

export default useTextInput;
