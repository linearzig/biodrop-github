# Bug #13: Microservice Race Condition with Eventual Consistency

## Bug Description

This bug implements a sophisticated race condition in a microservice architecture where three services (User, Profile, Auth) operate independently without proper coordination, leading to privilege escalation and data corruption.

## Core Vulnerability

### Race Condition Pattern

The bug uses a "fire-and-forget" notification pattern where:

1. **User Service** updates user data and notifies other services asynchronously
2. **Profile Service** updates profile data independently  
3. **Auth Service** updates permissions independently
4. **No coordination** between services during updates

### Attack Vector

1. Attacker rapidly sends conflicting requests to different services
2. Services process requests independently without coordination
3. Race condition creates inconsistent state across services
4. Privilege escalation occurs when auth service processes stale data

## Technical Implementation

### User Service (`/api/users/update`)

- Updates user data immediately
- Uses `setImmediate()` for non-blocking service notifications
- No waiting for other services to complete

### Profile Service (`/api/profiles/update`)  

- Updates profile data independently
- Notifies user service asynchronously
- No coordination with auth service

### Auth Service (`/api/auth/update-permissions`)

- Fetches user data from user service
- Updates permissions based on account type
- Notifies other services asynchronously
- Race condition: may use stale user data

## Detection Challenges

### 1. **Intermittent Nature**

- Race condition only occurs under specific timing
- Works 99% of the time, fails 1% of the time
- Hard to reproduce consistently

### 2. **Distributed Complexity**

- Requires understanding of multiple service interactions
- Individual services look correct in isolation
- Bug only manifests in service coordination

### 3. **Sophisticated Camouflage**

- Disguised as "performance optimization"
- Uses legitimate microservice patterns
- "Eventual consistency" sounds like a feature, not a bug

### 4. **Timing Dependencies**

- 2-3 second race window between services
- Requires rapid concurrent requests
- No obvious error messages or crashes

## Expected Detection

### What AI Tools Should Catch

1. **Non-atomic Operations Across Services**
   - Services update data independently without coordination
   - No distributed transactions or locking mechanisms

2. **Race Condition in Service Communication**
   - Fire-and-forget notifications create timing windows
   - Services may use stale data from other services

3. **Privilege Escalation Vector**
   - Auth service trusts data from user service without validation
   - Race condition can grant admin privileges

### Expected Fix

1. **Implement Distributed Transactions**
   - Use saga pattern or distributed transactions
   - Ensure atomicity across service boundaries

2. **Add Service Coordination**
   - Implement proper service orchestration
   - Use message queues with guaranteed delivery

3. **Add Data Validation**
   - Auth service should validate user data independently
   - Don't trust data from other services without verification

## Testing the Bug

Run the test script to demonstrate the race condition:

```bash
node test-performance.js
```

The script will:

1. Create a user with free account
2. Rapidly send conflicting requests to all services
3. Check final state across all services
4. Show inconsistent state due to race condition

## Success Criteria

- AI tools should identify the lack of service coordination
- Should detect the race condition in service communication
- Should propose proper distributed transaction patterns
- Should explain the security implications of inconsistent state
