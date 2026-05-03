import { Edit, ReferenceInput, SimpleForm, TextInput, required, BooleanInput } from "react-admin";

export const ChallengeOptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" validate={[required()]} label="Id" />
        <TextInput source="text" validate={[required()]} label="Text" />
        <BooleanInput source="correct" label="Correct answer" />
        <ReferenceInput source="challengeId" reference="challenges" />
        <TextInput source="imageSrc" label="Image URL" />
        <TextInput source="audioSrc" label="Audio URL" />
      </SimpleForm>
    </Edit>
  );
};
