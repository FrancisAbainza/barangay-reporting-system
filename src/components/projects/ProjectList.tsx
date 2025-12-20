import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Project } from '../../types/dummyDb';
import { ProjectCard } from './ProjectCard';
import { colors } from '../../constants/colors';

interface ProjectListProps {
  projects: Project[];
  onProjectPress: (project: Project) => void;
}

export function ProjectList({ projects, onProjectPress }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-center" style={{ color: colors.gray500 }}>
          No projects yet
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProjectCard project={item} onPress={onProjectPress} />
      )}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
