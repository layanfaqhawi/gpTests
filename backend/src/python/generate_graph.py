import sys, json, argparse, random
import networkx as nx

#directed graph -> nx.gnm_random_graph(num_nodes, num_edges, directed=True)

#weighted graph -> generate a graph, traverse the edges and assign random weights to them (use a range of weights, e.g., 1 to 10)

#connected graph -> generate a random spanning tree (which ensures connectivity) and then add additional edges randomly until you reach 
#the desired number of edges -> nx.random_labeled_tree(num_nodes) to generate a random spanning tree, then add edges until you reach num_edges

#cyclic graph -> generate a random spanning tree (which is acyclic) and then add edges randomly until you create cycles -> nx.random_labeled_tree(num_nodes) 
#to generate a random spanning tree, then add edges until you create cycles or generate any graph, check if its cyclic, it not add edges until it is cyclic

#sparse graph -> generate a random graph with a low edge-to-node ratio, e.g., num_edges = num_nodes - 1 (which creates a tree) or num_edges = num_nodes (which creates a slightly denser graph)
# -> basically to generate a sparse or dense graph, just manipulate the number of nodes and edges according to 

def generate_graph(config, num_nodes, num_edges):
    key = (config.directed, config.connected, config.cyclic)
    
    routes = {
        (False, True, True): generate_undirected_connected_cyclic,
        (False, True, False): generate_undirected_connected_acyclic,
        (False, False, True): generate_undirected_disconnected_cyclic,
        (False, False, False): generate_undirected_disconnected_acyclic,
        
        (True, True, True): generate_directed_connected_cyclic,
        (True, True, False): generate_directed_connected_acyclic,
        (True, False, True): generate_directed_disconnected_cyclic,
        (True, False, False): generate_directed_disconnected_acyclic,
    }
    
    generator_function = routes[key]
    G = generator_function(num_nodes, num_edges)
    
    if (config.weighted):
        G = add_weights(G)
    
    return G



# Undirected + Connected + Cyclic: build a tree then add random edges to force at least one cycle
def generate_undirected_connected_cyclic(num_nodes, num_edges):
    G = nx.random_labeled_tree(num_nodes)
    target_edges = max(num_edges, num_nodes)
    while G.number_of_edges() < target_edges:
        u, v = random.sample(list(G.nodes()), 2)
        if not G.has_edge(u, v):
            G.add_edge(u, v)
    return G

    
# Undirected + Connected + Acyclic: a connected acyclic undirected graph is exactly a tree
def generate_undirected_connected_acyclic(num_nodes, num_edges):
    G = nx.random_labeled_tree(num_nodes)
    return G

    
# Undirected + Disconnected + Cyclic: create a small cycle component and a tree component, then combine
def generate_undirected_disconnected_cyclic(num_nodes, num_edges):
    if num_nodes < 4:
        return nx.Graph()

    A = nx.cycle_graph(3)
    B = nx.random_labeled_tree(num_nodes - 3)
    G = nx.disjoint_union(A, B)

    while G.number_of_edges() < num_edges:
        if random.random() < 0.7 and (num_nodes - 3) > 1:
            nodes = list(range(3, num_nodes))
        else:
            nodes = [0, 1, 2]

        u, v = random.sample(nodes, 2)
        if not G.has_edge(u, v):
            G.add_edge(u, v)

    return G
    
    
# Undirected + Disconnected + Acyclic: build a tree then remove one edge to make it a forest
def generate_undirected_disconnected_acyclic(num_nodes, num_edges):
    if num_nodes < 2:
        return nx.Graph()

    G = nx.random_labeled_tree(num_nodes)
    edge_to_remove = random.choice(list(G.edges()))
    G.remove_edge(*edge_to_remove)
    return G

    
# Directed + Connected (strongly) + Cyclic: create a directed cycle over all nodes, then add edges
def generate_directed_connected_cyclic(num_nodes, num_edges):
    G = nx.DiGraph()
    G.add_nodes_from(range(num_nodes))

    for i in range(num_nodes):
        G.add_edge(i, (i + 1) % num_nodes)

    while G.number_of_edges() < num_edges:
        u, v = random.sample(list(G.nodes()), 2)
        if not G.has_edge(u, v):
            G.add_edge(u, v)

    return G

    
# Directed + Connected (strongly) + Acyclic: impossible combination
def generate_directed_connected_acyclic(num_nodes, num_edges):
    raise ValueError("Impossible: a strongly connected directed graph cannot be acyclic.")

    
# Directed + Disconnected (weakly connected, not strongly) + Cyclic: two cycles connected one-way
def generate_directed_disconnected_cyclic(num_nodes, num_edges):
    if num_nodes < 4:
        return nx.DiGraph()

    G = nx.DiGraph()
    G.add_nodes_from(range(num_nodes))

    k = num_nodes // 2

    for i in range(k):
        G.add_edge(i, (i + 1) % k)

    for i in range(k, num_nodes):
        nxt = k + ((i - k + 1) % (num_nodes - k))
        G.add_edge(i, nxt)

    G.add_edge(0, k)

    while G.number_of_edges() < num_edges:
        u, v = random.sample(list(G.nodes()), 2)
        if u >= k and v < k:
            continue
        if not G.has_edge(u, v):
            G.add_edge(u, v)

    return G

    
# Directed + Disconnected (weakly connected, not strongly) + Acyclic: directed path backbone with forward edges only
def generate_directed_disconnected_acyclic(num_nodes, num_edges):
    G = nx.DiGraph()
    G.add_nodes_from(range(num_nodes))

    for i in range(num_nodes - 1):
        G.add_edge(i, i + 1)

    while G.number_of_edges() < num_edges:
        u, v = random.sample(list(G.nodes()), 2)
        if u < v and not G.has_edge(u, v):
            G.add_edge(u, v)

    return G


def add_weights(G, weight_range=(1, 10)):
    for (u, v) in G.edges():
        G.edges[u, v]['weight'] = random.randint(*weight_range)
    return G


def convert_to_adjacency_list(G):
    adjacency_list = {node: list(G.neighbors(node)) for node in G.nodes()}
    return adjacency_list

if __name__ == "__main__":
    try:
        payload = json.loads(sys.stdin.read())

        data = payload["config"]

        # Convert to simple object so your existing code works
        class Config:
            def __init__(self, data):
                self.directed = data["directed"]
                self.weighted = data["weighted"]
                self.cyclic = data["cyclic"]
                self.connected = data["connected"]

        config = Config(data)

        num_nodes = payload.get("num_nodes", 5)  # Default to 5 if not provided
        num_edges = payload.get("num_edges", 0)  # Default to 0 if not provided

        G = generate_graph(config, num_nodes, num_edges)

        if config.weighted:
            adj = {
                str(node): {
                    str(nbr): G.edges[node, nbr].get("weight", 1)
                    for nbr in G.neighbors(node)
                }
                for node in G.nodes()
            }
        else:
            adj = {str(node): [str(nbr) for nbr in G.neighbors(node)] for node in G.nodes()}
        print(json.dumps(adj))

    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
          
    
