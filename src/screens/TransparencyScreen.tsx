import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransparencyStackParamList } from '../navigation/AuthenticatedTabs';
import { ScreenContainer, ScreenHeader, ProjectList } from '../components';
import { useDummyDb } from '../contexts/DummyDbContext';
import { Project } from '../types/dummyDb';

type Props = NativeStackScreenProps<TransparencyStackParamList, 'ProjectsList'>;

export default function TransparencyScreen({ navigation }: Props) {
  const { projects } = useDummyDb();

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectDetail', { projectId: project.id });
  };

  return (
    <ScreenContainer scrollable={false} keyboardAvoiding={false}>
      <ScreenHeader title="Transparency" />
      <View className="flex-1">
        <ProjectList projects={projects} onProjectPress={handleProjectPress} />
      </View>
    </ScreenContainer>
  );
}
