import sys, json, argparse, random
import networkx as nx

def generate_graph(num_nodes, num_edges):
    G = nx.gnm_random_graph(num_nodes, num_edges)
    return G

def convert_to_adjacency_list(G):
    adjacency_list = {node: list(G.neighbors(node)) for node in G.nodes()}
    return adjacency_list

if __name__ == "__main__":
    G = generate_graph(10, 15)
    adj = convert_to_adjacency_list(G)
    
    print(G)
    print("Nodes:", G.nodes())
    print("Edges:", G.edges())
    print("Generated graph with {} nodes and {} edges".format(G.number_of_nodes(), G.number_of_edges()))
    print(json.dumps(nx.node_link_data(G)))
    
    print("Adjacency List:", adj)
    print("Adjacency List:", json.dumps(adj))
    print("Adjacency List (pretty):", json.dumps(adj, indent=4))
          
    