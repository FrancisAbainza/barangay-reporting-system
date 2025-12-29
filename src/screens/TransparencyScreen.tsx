import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransparencyStackParamList } from '../navigation/AuthenticatedTabs';
import { ScreenContainer, ScreenHeader } from '../components';
import { ProjectList, ProjectFilter, ProjectFilters } from '../components/projects';
import { useProjectDb } from '../contexts/ProjectDbContext';
import { Project } from '../types/project';

type Props = NativeStackScreenProps<TransparencyStackParamList, 'ProjectsList'>;

export default function TransparencyScreen({ navigation }: Props) {
  const { projects } = useProjectDb();
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    category: [],
    dateRange: undefined,
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by status
      if (filters.status.length > 0 && !filters.status.includes(project.status)) {
        return false;
      }

      // Filter by category
      if (filters.category.length > 0 && !filters.category.includes(project.category)) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange?.start && filters.dateRange?.end) {
        const projectDate = new Date(project.startDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        // Set time to start/end of day for accurate comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        if (projectDate < startDate || projectDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.status.length +
      filters.category.length +
      (filters.dateRange?.start && filters.dateRange?.end ? 1 : 0)
    );
  }, [filters]);

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectDetail', { projectId: project.id });
  };

  return (
    <ScreenContainer scrollable={false} keyboardAvoiding={false}>
      <ScreenHeader
        subtitle='List of government projects and initiatives across the barangay for transparency.'
        bordered
      />
      
      <ProjectFilter
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
      
      <View className="flex-1">
        <ProjectList projects={filteredProjects} onProjectPress={handleProjectPress} />
      </View>
    </ScreenContainer>
  );
}
