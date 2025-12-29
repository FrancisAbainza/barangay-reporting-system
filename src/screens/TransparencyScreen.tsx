import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransparencyStackParamList } from '../navigation/AuthenticatedTabs';
import { ScreenContainer, ScreenHeader, ProjectList } from '../components';
import { useProjectDb } from '../contexts/ProjectDbContext';
import { Project } from '../types/project';

type Props = NativeStackScreenProps<TransparencyStackParamList, 'ProjectsList'>;

export default function TransparencyScreen({ navigation }: Props) {
  const { projects } = useProjectDb();

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectDetail', { projectId: project.id });
  };

  return (
    <ScreenContainer scrollable={false} keyboardAvoiding={false}>
      <ScreenHeader
        subtitle='List of government projects and initiatives across the barangay for transparency.'
        bordered
      />
      <View className="flex-1">
        <ProjectList projects={projects} onProjectPress={handleProjectPress} />
      </View>
    </ScreenContainer>
  );
}
