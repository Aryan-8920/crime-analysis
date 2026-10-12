import { Entity, Relationship } from '../types';

export interface MultiHopResult {
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  depthMap: Map<string, number>; // entityId -> hop distance
}

/**
 * Perform breadth-first traversal up to maxHops from startEntityId
 * Handles undirected or directed graph traversal (default undirected for investigative exploration)
 */
export function getMultiHopNeighborhood(
  startEntityId: string,
  relationships: Relationship[],
  maxHops: number = 1
): MultiHopResult {
  const result: MultiHopResult = {
    nodeIds: new Set([startEntityId]),
    edgeIds: new Set(),
    depthMap: new Map([[startEntityId, 0]]),
  };

  if (maxHops < 1) return result;

  // Build adjacency list with edge references
  // map: entityId -> list of { neighborId, edgeId }
  const adj = new Map<string, Array<{ neighborId: string; edgeId: string }>>();

  for (const rel of relationships) {
    // only consider accepted or verified relationships in active traversal
    if (rel.reviewStatus === 'Rejected') continue;

    if (!adj.has(rel.sourceEntityId)) adj.set(rel.sourceEntityId, []);
    if (!adj.has(rel.targetEntityId)) adj.set(rel.targetEntityId, []);

    adj.get(rel.sourceEntityId)!.push({ neighborId: rel.targetEntityId, edgeId: rel.id });
    adj.get(rel.targetEntityId)!.push({ neighborId: rel.sourceEntityId, edgeId: rel.id });
  }

  // BFS Queue: [entityId, currentHop]
  const queue: Array<[string, number]> = [[startEntityId, 0]];
  const visited = new Set<string>([startEntityId]);

  while (queue.length > 0) {
    const [currId, currentHop] = queue.shift()!;

    if (currentHop >= maxHops) continue;

    const neighbors = adj.get(currId) || [];
    for (const { neighborId, edgeId } of neighbors) {
      result.edgeIds.add(edgeId);

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        result.nodeIds.add(neighborId);
        result.depthMap.set(neighborId, currentHop + 1);
        queue.push([neighborId, currentHop + 1]);
      }
    }
  }

  return result;
}

/**
 * Find shortest path between two nodes using BFS
 * Returns path node IDs and edge IDs in order
 */
export function findShortestPath(
  sourceId: string,
  targetId: string,
  relationships: Relationship[]
): { pathNodeIds: string[]; pathEdgeIds: string[] } | null {
  if (sourceId === targetId) {
    return { pathNodeIds: [sourceId], pathEdgeIds: [] };
  }

  const adj = new Map<string, Array<{ neighborId: string; edgeId: string }>>();
  for (const rel of relationships) {
    if (rel.reviewStatus === 'Rejected') continue;
    if (!adj.has(rel.sourceEntityId)) adj.set(rel.sourceEntityId, []);
    if (!adj.has(rel.targetEntityId)) adj.set(rel.targetEntityId, []);

    adj.get(rel.sourceEntityId)!.push({ neighborId: rel.targetEntityId, edgeId: rel.id });
    adj.get(rel.targetEntityId)!.push({ neighborId: rel.sourceEntityId, edgeId: rel.id });
  }

  const queue: string[] = [sourceId];
  const visited = new Set<string>([sourceId]);
  // track parent node and edge used to reach node
  const parent = new Map<string, { prevNodeId: string; edgeId: string }>();

  let found = false;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === targetId) {
      found = true;
      break;
    }

    const neighbors = adj.get(curr) || [];
    for (const { neighborId, edgeId } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        parent.set(neighborId, { prevNodeId: curr, edgeId });
        queue.push(neighborId);
      }
    }
  }

  if (!found) return null;

  // Reconstruct path
  const pathNodeIds: string[] = [];
  const pathEdgeIds: string[] = [];
  let curr = targetId;

  while (curr !== sourceId) {
    pathNodeIds.unshift(curr);
    const p = parent.get(curr)!;
    pathEdgeIds.unshift(p.edgeId);
    curr = p.prevNodeId;
  }
  pathNodeIds.unshift(sourceId);

  return { pathNodeIds, pathEdgeIds };
}

/**
 * Calculate connection count for each entity in the current case
 */
export function calculateDegrees(
  entities: Entity[],
  relationships: Relationship[]
): Map<string, number> {
  const degrees = new Map<string, number>();
  for (const ent of entities) {
    degrees.set(ent.id, 0);
  }

  for (const rel of relationships) {
    if (rel.reviewStatus === 'Rejected') continue;
    if (degrees.has(rel.sourceEntityId)) {
      degrees.set(rel.sourceEntityId, (degrees.get(rel.sourceEntityId) || 0) + 1);
    }
    if (degrees.has(rel.targetEntityId)) {
      degrees.set(rel.targetEntityId, (degrees.get(rel.targetEntityId) || 0) + 1);
    }
  }

  return degrees;
}
